import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException, InternalServerErrorException, Put } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AutoAssignmentService } from './auto-assignment.service';
import { AutoAssignmentDto } from './dto/auto-assignment.dto';
import { UpdateAutoAssignmentDto } from './dto/update-auto-assignment.dto';

@Controller('auto-assignment')
export class AutoAssignmentController {
    constructor(
        private readonly autoAssignmentService: AutoAssignmentService,
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
    })
    async performAutoAssignment(@Body() autoAssignmentDto: AutoAssignmentDto) {
        try {
            const resultParttime = await this.autoAssignmentService.autoAssignParttimeShifts(autoAssignmentDto.partTimeOption);
            const resultFulltime = await this.autoAssignmentService.autoAssignFulltimeShifts(autoAssignmentDto.fullTimeOption);

            // Check if both operations were successful
            const parttimeSuccess = resultParttime?.success === true;
            const fulltimeSuccess = resultFulltime?.success === true;

            if (parttimeSuccess && fulltimeSuccess) {
                await this.autoAssignmentService.updateNextWeekEnrollment();
                return {
                    status: 201,
                    success: true,
                    message: 'Auto assignment successfully performed for both part-time and full-time shifts',
                    partTimeResult: resultParttime,
                    fullTimeResult: resultFulltime,
                };
            } else if (parttimeSuccess || fulltimeSuccess) {
                if (parttimeSuccess) {
                    await this.autoAssignmentService.updateNextWeekEnrollment();
                }
                return {
                    status: 207,
                    success: false,
                    message: 'Auto assignment partially completed - some operations failed',
                    partTimeResult: resultParttime,
                    fullTimeResult: resultFulltime,
                };
            } else {
                return {
                    status: 500,
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

    @Put()
    @ApiOperation({
        summary: 'Update auto assignment settings',
    })
    @ApiBody({
        description: 'Update auto assignment settings',
        type: UpdateAutoAssignmentDto,
        examples: {
            example1: {
                summary: 'Basic Example',
                value: {
                    data: [
                        {
                            type: "employee",
                            cols: ["RuleDescription", "RuleName", "OtherCol"]
                        },
                        {
                            type: "shift",
                            cols: ["RuleDescription2", "RuleName2", "OtherCol2"]
                        },
                        {
                            type: "enrollmentshift",
                            cols: ["RuleDescription3", "RuleName3", "OtherCol3"]
                        },
                        {
                            type: "enrollmentemployee",
                            cols: ["RuleDescription4", "RuleName4", "OtherCol4"]
                        }
                    ]
                }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Auto assignment settings successfully updated',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: { type: 'object' }
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
    async updateAutoAssignmentSettings(@Body() updateAutoAssignmentDto: UpdateAutoAssignmentDto) {
        try {
            const result = await this.autoAssignmentService.updateAutoAssignmentSettings(updateAutoAssignmentDto);

            return {
                success: true,
                message: 'Auto assignment settings successfully updated',
                data: result,
            };
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            return {
                success: false,
                message: 'Failed to update auto assignment settings',
                error: errorMsg
            };
        }
    }

    @Get()
    @ApiOperation({
        summary: 'Get auto assignment settings',
    })
    @ApiResponse({
        status: 200,
        description: 'Auto assignment settings retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: { type: 'object' }
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
    async getAutoAssignmentSettings() {
        try {
            const settings = await this.autoAssignmentService.getAutoAssignmentSettings();
            return {
                status: 200,
                success: true,
                message: 'Auto assignment settings retrieved successfully',
                data: settings,
            };
        } catch (error) {
            console.error('Controller error in getAutoAssignmentSettings:', error);
            throw new InternalServerErrorException({
                success: false,
                message: 'Failed to retrieve auto assignment settings',
                error: error.message
            });
        }
    }
    @Patch('update-nextweek-enrollment')
    @ApiOperation({ summary: 'Update all shift_enrollment in next week to assigned if shift_assignment exists (auto, no params)' })
    @ApiResponse({ status: 200, description: 'Update next week enrollmentstatus successfully' })
    async updateNextWeekEnrollment() {
        return this.autoAssignmentService.updateNextWeekEnrollment();
    }
}