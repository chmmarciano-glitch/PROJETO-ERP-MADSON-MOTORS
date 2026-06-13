import bcrypt from 'bcryptjs';
import { supabase } from '../utils/supabase';
import { generateToken } from '../utils/jwt';
import { User, AuthResponse } from '../types';
import logger from '../utils/logger';

export class AuthService {
  /**
   * Fazer login com email e senha
   */
  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // 1. Buscar usuário no Supabase
      const { data: users, error: searchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (searchError || !users) {
        logger.warn(`❌ Tentativa de login com email não encontrado: ${email}`);
        throw new Error('Email ou senha incorretos');
      }

      // 2. Validar senha
      const passwordMatch = await bcrypt.compare(password, users.password_hash);
      if (!passwordMatch) {
        logger.warn(`❌ Senha incorreta para usuário: ${email}`);
        throw new Error('Email ou senha incorretos');
      }

      // 3. Gerar JWT token
      const token = generateToken({
        userId: users.id,
        email: users.email,
        role: users.role,
        departamento_id: users.departamento_id,
      });

      // 4. Atualizar último login
      await supabase
        .from('users')
        .update({ ultimo_login: new Date().toISOString() })
        .eq('id', users.id);

      logger.info(`✅ Login bem-sucedido para usuário: ${email}`);

      return {
        access_token: token,
        user: {
          id: users.id,
          email: users.email,
          full_name: users.full_name,
          role: users.role,
          departamento_id: users.departamento_id,
          ativo: users.ativo,
          ultimo_login: users.ultimo_login,
          created_at: users.created_at,
          updated_at: users.updated_at,
        },
        expires_in: '7d',
      };
    } catch (error) {
      logger.error('Erro ao fazer login:', error);
      throw error;
    }
  }

  /**
   * Registrar novo usuário
   */
  static async register(
    email: string,
    password: string,
    full_name: string,
    role: string = 'visualizador'
  ): Promise<User> {
    try {
      // 1. Verificar se email já existe
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existing) {
        throw new Error('Este email já está registrado');
      }

      // 2. Hash da senha
      const password_hash = await bcrypt.hash(password, 10);

      // 3. Criar usuário
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
          {
            email,
            password_hash,
            full_name,
            role,
            ativo: true,
          }
        ])
        .select()
        .single();

      if (createError || !newUser) {
        throw new Error('Erro ao criar usuário');
      }

      logger.info(`✅ Novo usuário registrado: ${email}`);

      return {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
        departamento_id: newUser.departamento_id,
        ativo: newUser.ativo,
        ultimo_login: newUser.ultimo_login,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at,
      };
    } catch (error) {
      logger.error('Erro ao registrar usuário:', error);
      throw error;
    }
  }

  /**
   * Obter usuário por ID
   */
  static async getUserById(userId: string): Promise<User> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !user) {
        throw new Error('Usuário não encontrado');
      }

      return {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        departamento_id: user.departamento_id,
        ativo: user.ativo,
        ultimo_login: user.ultimo_login,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
    } catch (error) {
      logger.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }
}
