import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException, InternalServerErrorException, Put } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AutoAssignmentService } from './auto-assignment.service';
import { ExcelManipulationService } from './excel-manipulation.service';
import { AutoAssignmentDto } from './dto/auto-assignment.dto';

@Controller('auto-assignment')
export class AutoAssignmentController {
    constructor(
        private readonly autoAssignmentService: AutoAssignmentService,
        private readonly excelManipulationService: ExcelManipulationService
    ) { }

    @Post()
    @ApiOperation({
        summary: 'Perform auto assignment',
    })
    @ApiBody({
        description: 'Trigger auto assignment process',
        type: AutoAssignmentDto,
    }) @ApiResponse({
        status: 201,
        description: 'Auto assignment successfully performed',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                partTimeResult: { type: 'object' },
                fullTimeResult: { type: 'object' }
            }
        }
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string' },
                error: { type: 'string' }
            }
        }
    })
    @ApiResponse({
        status: 207,
        description: 'Partial success - some operations failed',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string' },
                partTimeResult: { type: 'object' },
                fullTimeResult: { type: 'object' }
            }
        }
    }) async performAutoAssignment(@Body() autoAssignmentDto: AutoAssignmentDto) {
        try {
            const resultParttime = await this.autoAssignmentService.autoAssignParttimeShifts(autoAssignmentDto.partTimeOption);
            const resultFulltime = await this.autoAssignmentService.autoAssignFulltimeShifts(autoAssignmentDto.fullTimeOption);

            // Check if both operations were successful
            const parttimeSuccess = resultParttime?.success === true;
            const fulltimeSuccess = resultFulltime?.success === true;

            if (parttimeSuccess && fulltimeSuccess) {
                return {
                    success: true,
                    message: 'Auto assignment successfully performed for both part-time and full-time shifts',
                    partTimeResult: resultParttime,
                    fullTimeResult: resultFulltime,
                };
            } else if (parttimeSuccess || fulltimeSuccess) {
                return {
                    success: false,
                    message: 'Auto assignment partially completed - some operations failed',
                    partTimeResult: resultParttime,
                    fullTimeResult: resultFulltime,
                };
            } else {
                return {
                    success: false,
                    message: 'Auto assignment failed for both part-time and full-time shifts',
                    partTimeResult: resultParttime,
                    fullTimeResult: resultFulltime,
                };
            }
        } catch (error) {
            console.error('Controller error in performAutoAssignment:', error);
            throw new InternalServerErrorException({
                success: false,
                message: 'Failed to perform auto assignment',
                error: error.message
            });
        }
    }
}