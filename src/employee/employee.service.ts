import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from 'schema/employee.schema';
import { EmployeeRepository } from '../../repository/employee.repository';

@Injectable()
export class EmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async create(employee: Employee): Promise<EmployeeDocument> {
    return this.employeeRepository.create(employee);
  }

  async findOne(id: string): Promise<EmployeeDocument> {
    return this.employeeRepository.findOne(id);
  }
}
