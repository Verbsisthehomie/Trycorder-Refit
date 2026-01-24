CREATE TABLE `conversation_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`role` enum('user','assistant'),
	`content` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `conversation_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `crew_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`rank` varchar(64),
	`position` varchar(255),
	`email` varchar(320),
	`phone` varchar(20),
	`notes` text,
	`evaluation` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crew_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `media_files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`filename` varchar(255) NOT NULL,
	`fileType` varchar(64),
	`fileUrl` text,
	`fileKey` text,
	`fileSize` int,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `media_files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sensor_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`temperature` decimal(8,2),
	`pressure` decimal(8,2),
	`light` decimal(10,2),
	`magnetic` decimal(8,2),
	`gravity` decimal(8,2),
	`orientationAlpha` decimal(8,2),
	`orientationBeta` decimal(8,2),
	`orientationGamma` decimal(8,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sensor_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `server_connections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`host` varchar(255) NOT NULL,
	`port` int,
	`username` varchar(255),
	`connectionType` enum('ssh','ftp','http'),
	`lastConnected` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `server_connections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `terminal_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`serverId` int,
	`sessionData` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `terminal_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `voice_commands` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`transcript` text,
	`command` varchar(64),
	`confidence` decimal(5,4),
	`result` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `voice_commands_id` PRIMARY KEY(`id`)
);
