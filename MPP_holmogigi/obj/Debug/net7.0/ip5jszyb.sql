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

CREATE TABLE [Users] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(450) NULL,
    [Password] nvarchar(max) NULL,
    [AccessLevel] int NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Bodybuilders] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NULL,
    [Age] int NOT NULL,
    [Weight] int NOT NULL,
    [Height] int NOT NULL,
    [Division] nvarchar(max) NULL,
    [UserId] int NOT NULL,
    CONSTRAINT [PK_Bodybuilders] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Bodybuilders_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id])
);
GO

CREATE TABLE [ConfirmationCodes] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [Code] nvarchar(450) NULL,
    [Expiration] datetime2 NULL,
    [Used] bit NOT NULL,
    CONSTRAINT [PK_ConfirmationCodes] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ConfirmationCodes_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id])
);
GO

CREATE TABLE [Gyms] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NULL,
    [Location] nvarchar(max) NULL,
    [Memembership] int NOT NULL,
    [Grade] int NOT NULL,
    [UserId] int NOT NULL,
    CONSTRAINT [PK_Gyms] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Gyms_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id])
);
GO

CREATE TABLE [UserProfiles] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [Bio] nvarchar(max) NULL,
    [Location] nvarchar(max) NULL,
    [Birthday] datetime2 NULL,
    [Gender] nvarchar(max) NULL,
    [MaritalStatus] nvarchar(max) NULL,
    [PagePreference] int NOT NULL,
    CONSTRAINT [PK_UserProfiles] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_UserProfiles_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [Coaches] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NULL,
    [Age] int NOT NULL,
    [Rate] int NOT NULL,
    [GymId] int NOT NULL,
    [UserId] int NOT NULL,
    CONSTRAINT [PK_Coaches] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Coaches_Gyms_GymId] FOREIGN KEY ([GymId]) REFERENCES [Gyms] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Coaches_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id])
);
GO

CREATE TABLE [Contests] (
    [CoachId] int NOT NULL,
    [BodybuilderId] int NOT NULL,
    [DateTime] datetime2 NOT NULL,
    [Name] nvarchar(max) NULL,
    [Location] nvarchar(max) NULL,
    [UserId] int NOT NULL,
    CONSTRAINT [PK_Contests] PRIMARY KEY ([BodybuilderId], [CoachId]),
    CONSTRAINT [FK_Contests_Bodybuilders_BodybuilderId] FOREIGN KEY ([BodybuilderId]) REFERENCES [Bodybuilders] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Contests_Coaches_CoachId] FOREIGN KEY ([CoachId]) REFERENCES [Coaches] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Contests_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id])
);
GO

CREATE INDEX [IX_Bodybuilders_UserId] ON [Bodybuilders] ([UserId]);
GO

CREATE INDEX [IX_Coaches_GymId] ON [Coaches] ([GymId]);
GO

CREATE INDEX [IX_Coaches_UserId] ON [Coaches] ([UserId]);
GO

CREATE UNIQUE INDEX [IX_ConfirmationCodes_Code] ON [ConfirmationCodes] ([Code]) WHERE [Code] IS NOT NULL;
GO

CREATE INDEX [IX_ConfirmationCodes_UserId] ON [ConfirmationCodes] ([UserId]);
GO

CREATE INDEX [IX_Contests_CoachId] ON [Contests] ([CoachId]);
GO

CREATE INDEX [IX_Contests_UserId] ON [Contests] ([UserId]);
GO

CREATE INDEX [IX_Gyms_UserId] ON [Gyms] ([UserId]);
GO

CREATE UNIQUE INDEX [IX_UserProfiles_UserId] ON [UserProfiles] ([UserId]);
GO

CREATE UNIQUE INDEX [IX_Users_Name] ON [Users] ([Name]) WHERE [Name] IS NOT NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20230512213341_initia3', N'7.0.4');
GO

COMMIT;
GO

