import {ApiProperty} from '@nestjs/swagger';
import {IsNumber, IsString} from 'class-validator';

export class TruckEntity {
    @ApiProperty({
        type: Number,
        uniqueItems: true,
        description: 'Truck`s identifier',
        nullable: false,
        readOnly: true,
    })
    id: number;

    @ApiProperty({
        type: Boolean,
        description: 'Indicates, if a Truck being watched and it`s data being refreshed',
        default: true,
        nullable: false
    })
    watch: Boolean;


    @ApiProperty({
        type: Number,
        uniqueItems: true,
        description: 'Truck`s id. As it is enumerated in original DB (!!! parsed data)',
        nullable: true,
    })
    @IsString()
    code: string;

    @ApiProperty({
        type: String,
        description: 'Trucks`s aggregated name. As it is named in original DB',
        nullable: false,
    })
    @IsString()
    name: string;

    @ApiProperty({
        type: String,
        description: 'Indicates the state of a Truck movement (!!! parsed data)',
        nullable: true,
    })
    @IsString()
    stop: string;

    @ApiProperty({
        type: String,
        description: 'Indicates the state of a Truck transponders (!!! parsed data)',
        nullable: true,
    })
    @IsString()
    tracing: string;

    @ApiProperty({
        type: Date,
        description: 'Date of creation',
        readOnly: true,
        nullable: false,
    })
    createdAt: Date;
    @ApiProperty({
        type: Date,
        description: 'The last date of being modified',
        readOnly: true,
        nullable: false,
    })
    updatedAt: Date;
}
