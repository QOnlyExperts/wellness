import { Transaction } from "sequelize";
import { UserEntity } from "../../domain/entities/UserEntity";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { LoginModel, InfoPersonModel, ProgramModel } from "../models/indexModel";
import { RoleModel } from "../models/RoleModel";
import { UserMapper } from "../../application/mappers/UserMapper";


export class SequelizeUserRepository implements IUserRepository {

  async findAll(): Promise<UserEntity[]> {
    const userList = await LoginModel.findAll({
      attributes: [
        'id',
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
          include: [
            {
              model: ProgramModel
            }
          ]
        },{
          model: RoleModel
        }
      ]
    });

    return userList.map(user => UserMapper.toDomain(user?.toJSON()));
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await LoginModel.findOne({
      where: {
        email
      },
      attributes: [
        'id',
        'email',
        'password',
        'is_verified',
        'is_active',
        'created_at',
        'updated_at',
        'last_login',
        'info_person_id',
        'rol_id'
      ],
      include: [{
        model: InfoPersonModel
      }]
    });

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user?.toJSON());
  }

  async findByIdInfoPerson(id: number): Promise<UserEntity | null> {
    const user = await LoginModel.findOne({
      where: {
        info_person_id: id
      },
      attributes: [
        'id',
        'email',
        'is_verified',
        'is_active',
        'created_at',
        'updated_at',
        'last_login',
        'info_person_id',
        'rol_id'
      ],
    });

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user?.toJSON());
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await LoginModel.findByPk(id, {
      attributes: [
        'id',
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
          include: [
            {
              model: ProgramModel
            }
          ]
        }
      ]
    });

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user?.toJSON());
  }

  async findByIdProfile(id: number): Promise<UserEntity | null> {
    const user = await LoginModel.findByPk(id, {
      attributes: [
        'id',
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
          include: [
            {
              model: ProgramModel
            }
          ]
        }
      ]
    });

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user?.toJSON());
  }

  async save(user: UserEntity, t: Transaction): Promise<UserEntity> {
    const persistenceData = UserMapper.toPersistence(user);

    const saveModel = await LoginModel.create(persistenceData, {
      transaction: t
    });

    return UserMapper.toDomain(saveModel.toJSON());
  }

  // async updatePassword(id: number, user: Partial<UserEntity>): Promise<UserEntity> {
  
  //   if(!user){

  //   }

  //   await LoginModel.update({password: user.password}, {where: {id: id}});
  // }
}