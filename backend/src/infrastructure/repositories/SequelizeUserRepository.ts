import { Transaction } from "sequelize";
import { UserEntity } from "../../domain/entities/UserEntity";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { LoginModel } from "../models/LoginModel";
import { InfoPersonModel } from "../models/InfoPersonModel";
import { RoleModel } from "../models/RoleModel";
import { UserMapper } from "../../application/mappers/UserMapper";


export class SequelizeUserRepository implements IUserRepository {

  async findAll(): Promise<UserEntity[]> {
    const userList = await LoginModel.findAll({
      attributes: [
        'email',
        'is_verified',
        'is_active',
        'created_at',
        'updated_at',
        'last_login',
        'info_person_id',
        'rol_id'
      ],
      include: [
        {
          model: InfoPersonModel,
        },{
          model: RoleModel
        }
      ]
    });

    return userList.map(user => UserMapper.toDomain(user.toJSON()));
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await LoginModel.findByPk(id, {
      attributes: [
        'email',
        'is_verified',
        'is_active',
        'created_at',
        'updated_at',
        'last_login',
        'info_person_id',
        'rol_id'
      ],
      include: [
        {
          model: InfoPersonModel,
        },{
          model: RoleModel
        }
      ]
    });

    return UserMapper.toDomain(user?.toJSON());
  }

  async findByIdProfile(id: number): Promise<UserEntity | null> {
    const user = await LoginModel.findByPk(id, {
      attributes: [
        'email',
        'is_verified',
        'is_active',
        'info_person_id',
        'rol_id'
      ],
      include: [
        {
          model: InfoPersonModel,
        },{
          model: RoleModel
        }
      ]
    });

    return UserMapper.toDomain(user?.toJSON());
  }

  save(user: UserEntity, t: Transaction): Promise<UserEntity> {
    
  }

  updatePassword(id: number, data: Partial<UserEntity>): Promise<UserEntity> {
    
  }
}