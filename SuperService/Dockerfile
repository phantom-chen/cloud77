#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY [".", "SuperService/"]
RUN dotnet restore "SuperService/SuperService.csproj"
COPY . .
WORKDIR "/src/SuperService"
RUN dotnet build "SuperService.csproj" -c Release --self-contained false -r linux-x64 -f net8.0 -o /app/build

FROM build AS publish
RUN dotnet publish "SuperService.csproj" -c Release --self-contained false -r linux-x64 -f net8.0 -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "SuperService.dll"]