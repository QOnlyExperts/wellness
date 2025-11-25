
import { IUserRepository } from '../../../../domain/interfaces/IUserRepository';
import { IHashService } from '../../../../domain/interfaces/services/IHashService';
import { IJwtService } from '../../../../domain/interfaces/services/IJwtService';
import { ValidationError } from '../../../../shared/errors/DomainErrors';
import { LoginInputDto } from '../../../dtos/users/login/LoginInputDto';
import { LoginOutputDto } from '../../../dtos/users/login/LoginOutputDto';


export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private readonly hashService: IHashService,
    private readonly jwtService: IJwtService
  ) {}

  async execute(input: LoginInputDto): Promise<LoginOutputDto> {
    const { email, password } = input;

    // 1. Obtener usuario de la Infraestructura (BD)
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new ValidationError('Credenciales inválidas');
    }

    // 2. Verificar la contraseña usando la Infraestructura (Seguridad)
    const isPasswordValid = await this.hashService.compare(password, user.password);

    if (!isPasswordValid) {
      // Nota: Por seguridad, siempre se recomienda devolver el mismo ValidationError 
      // para usuario no encontrado o contraseña incorrecta.
      throw new ValidationError('Credenciales inválidas'); 
    }

    // 3. Generar el token de autenticación
    this.jwtService.setExpiresIn("6h");
    const token = this.jwtService.sign({userId: user.id});

    // 4. Retornar el resultado del Caso de Uso
    return {
      user: {
        id: user.id!,
        name: user.info_person?.name1 || '',
        email: user.email,
        info_person_id: user.info_person_id,
        rol: user.rol_id,
      },
      token: token,
    };
  }
}