IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230325175952_initial')
BEGIN
    CREATE TABLE [Bodybuilders] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(max) NULL,
        [Age] int NOT NULL,
        [Weight] int NOT NULL,
        [Height] int NOT NULL,
        [Division] nvarchar(max) NULL,
        CONSTRAINT [PK_Bodybuilders] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230325175952_initial')
BEGIN
    CREATE TABLE [Gyms] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(max) NULL,
        [Location] nvarchar(max) NULL,
        [Memembership] int NOT NULL,
        [Grade] int NOT NULL,
        CONSTRAINT [PK_Gyms] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230325175952_initial')
BEGIN
    CREATE TABLE [Coaches] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(max) NULL,
        [Age] int NOT NULL,
        [Rate] int NOT NULL,
        [GymId] int NOT NULL,
        CONSTRAINT [PK_Coaches] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Coaches_Gyms_GymId] FOREIGN KEY ([GymId]) REFERENCES [Gyms] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230325175952_initial')
BEGIN
    CREATE TABLE [Contests] (
        [CoachId] int NOT NULL,
        [BodybuilderId] int NOT NULL,
        [DateTime] datetime2 NOT NULL,
        [Name] nvarchar(max) NULL,
        [Location] nvarchar(max) NULL,
        CONSTRAINT [PK_Contests] PRIMARY KEY ([BodybuilderId], [CoachId]),
        CONSTRAINT [FK_Contests_Bodybuilders_BodybuilderId] FOREIGN KEY ([BodybuilderId]) REFERENCES [Bodybuilders] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_Contests_Coaches_CoachId] FOREIGN KEY ([CoachId]) REFERENCES [Coaches] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230325175952_initial')
BEGIN
    CREATE INDEX [IX_Coaches_GymId] ON [Coaches] ([GymId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230325175952_initial')
BEGIN
    CREATE INDEX [IX_Contests_CoachId] ON [Contests] ([CoachId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230325175952_initial')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20230325175952_initial', N'7.0.4');
END;
GO

COMMIT;
GO

