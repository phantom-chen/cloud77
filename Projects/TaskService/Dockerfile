#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:3.1 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build
WORKDIR /src
COPY ["todo-api/todo-api.csproj", "todo-api/"]
RUN dotnet restore "todo-api/todo-api.csproj"
COPY . .
WORKDIR "/src/todo-api"
RUN dotnet build "todo-api.csproj" -c Release -r linux-x64 -f netcoreapp3.1 -o /app/build

FROM build AS publish
RUN dotnet publish "todo-api.csproj" -c Release --self-contained false -r linux-x64 -f netcoreapp3.1 -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "todo-api.dll"]