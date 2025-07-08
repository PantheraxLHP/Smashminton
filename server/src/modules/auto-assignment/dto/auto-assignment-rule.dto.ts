import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNumber, IsOptional, IsNotEmpty, isArray, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class RuleCondition {
    @ApiProperty({
        description: 'Condition name',
        example: 'assignedShiftInWeek',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    conditionName: string;

    @ApiProperty({
        description: 'Condition value',
        example: '< 2',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    conditionValue: string;
}

export class RuleAction {
    @ApiProperty({
        description: 'Action name',
        example: 'setEligible',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    actionName: string;

    @ApiProperty({
        description: 'Action value',
        example: 'true',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    actionValue: string;
}

export class RuleSubObj {
    @ApiProperty({
        description: 'Object name',
        example: 'setEligible',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    subObjName: string;

    @ApiProperty({
        description: 'Object value',
        example: 'true',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    subObjValue: string;
}

export class SingleRowRule {
    @ApiProperty({
        description: 'Unique name for the rule',
        example: 'New Rule 1',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    ruleName: string;

    @ApiPropertyOptional({
        description: 'Description of the rule',
        example: 'This rule is used for ...',
        type: String,
    })
    @IsString()
    @Type(() => String)
    ruleDescription?: string;

    @ApiProperty({
        description: 'Type of rule',
        example: 'shift',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    ruleType: string;

    @ApiProperty({
        description: 'Conditions of rule',
        type: Array,
    })
    @IsNotEmpty()
    @IsArray()
    @Type(() => Array)
    subObj: RuleSubObj[];

    @ApiProperty({
        description: 'Conditions of rule',
        type: Array,
    })
    @IsNotEmpty()
    @IsArray()
    @Type(() => Array)
    conditions: RuleCondition[];

    @ApiProperty({
        description: 'Actions of rule',
        type: Array,
    })
    @IsNotEmpty()
    @IsArray()
    @Type(() => Array)
    actions: RuleAction[];
}

export class AutoAssignmentRule {
    @ApiProperty({
        description: 'Rows data',
        type: Array,
    })
    @IsNotEmpty()
    @IsArray()
    @Type(() => Array)
    data: SingleRowRule[];
}