import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException, InternalServerErrorException, Put } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AutoAssignmentService } from './auto-assignment.service';
import { AutoAssignmentDto } from './dto/auto-assignment.dto';

@Controller('auto-assignment')
export class AutoAssignmentController {
    constructor(private readonly autoAssignmentService: AutoAssignmentService) { }

    @Post()
    @ApiOperation({
        summary: 'Perform auto assignment',
    })
    @ApiBody({
        description: 'Trigger auto assignment process',
        type: AutoAssignmentDto,
    })
    @ApiResponse({
        status: 200,
        description: 'Auto assignment successfully performed',
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error',
    })
    async performAutoAssignment(@Body() autoAssignmentDto: AutoAssignmentDto) {
        try {
            await this.autoAssignmentService.autoAssignParttimeShifts(autoAssignmentDto.partTimeOption);
            await this.autoAssignmentService.autoAssignFulltimeShifts(autoAssignmentDto.fullTimeOption);
        } catch (error) {
            throw new InternalServerErrorException('Failed to perform auto assignment', error.message);
        }
    }
}