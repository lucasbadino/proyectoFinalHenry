import { TypeOrmModule } from '@nestjs/typeorm';
import {config } from 'dotenv';

config( {
    path: '.env.development'
});

export const dataSource = TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['dist/**/*.entity{.ts,.js}'], 
    synchronize: true,
    // logging: true,
    //dropSchema: true,
    ssl: {
        rejectUnauthorized: false, 
    },
})
