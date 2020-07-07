# node
FROM node:10-alpine as build-node
WORKDIR /client

COPY ./client/package.json .
COPY ./client/yarn.lock .
RUN yarn

COPY ./client/ .
RUN yarn build

# dotnet core
FROM mcr.microsoft.com/dotnet/core/sdk:2.2 AS build-dotnet
WORKDIR /server

COPY ./server/WebApi/*.csproj .
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o out

# publish
FROM mcr.microsoft.com/dotnet/core/aspnet:2.2
WORKDIR /client
COPY --from=build-node /client/build ./build

WORKDIR /server
COPY --from=build-dotnet /server/out .
CMD dotnet WebApi.dll