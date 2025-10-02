import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { Metadata, status } from '@grpc/grpc-js';
import type { ServerUnaryCall } from '@grpc/grpc-js';
import {
  CreateEmployeeRequest,
  CreateEmployeeResponse,
  GetOneEmployeeRequest,
  GetOneEmployeeResponse,
} from '../../proto/employee';
import { EmployeeService } from './employee.service';

@Controller()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @GrpcMethod('EmployeeService', 'CreateEmployee')
  async create(
    data: CreateEmployeeRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<CreateEmployeeResponse> {
    const employee = await this.employeeService.create(data);
    return {
      _id: employee._id.toString(),
    };
  }

  @GrpcMethod('EmployeeService', 'GetOneEmployee')
  async findOne(
    data: GetOneEmployeeRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<GetOneEmployeeResponse> {
    const employee = await this.employeeService.findOne(data._id);
    return {
      _id: employee._id.toString(),
      name: employee.name,
    };
  }
}
