create database if not exists zhxj_game character set utf8mb4;

-- 设置事务隔离级别为提交读
set global transaction isolation level read committed;

use zhxj_game;

-- 更改数据库编码，避免出现乱码
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_database = utf8mb4;
SET character_set_results = utf8mb4;
SET character_set_server = utf8mb4;