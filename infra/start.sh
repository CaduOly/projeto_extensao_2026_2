#!/bin/bash

# Exit on error
set -e

# Clear display
clear

echo "================================================================="
echo "      Iniciando Conecta Emprego Paranoá (Orquestrador)          "
echo "      Foco em Inclusão Econômica e Empreendedorismo (ODS 8)     "
echo "================================================================="
echo

# Check if Docker is installed on the host
if ! command -v docker &> /dev/null; then
    echo "❌ Erro: Docker não foi encontrado na sua máquina host."
    echo "Por favor, instale o Docker e tente novamente."
    exit 1
fi

# Locate current directory of the script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "🔄 [1/3] Limpando volumes e containers anteriores..."
if docker compose version &> /dev/null; then
    docker compose down -v
elif docker-compose --version &> /dev/null; then
    docker-compose down -v
else
    echo "⚠️  Não foi possível executar clean down automático, pulando..."
fi

echo
echo "🚀 [2/3] Construindo as imagens e iniciando os serviços..."
echo "Nota: O banco MySQL será inicializado e o NestJS sincronizará"
echo "o schema via Prisma automaticamente assim que o banco estiver saudável."
echo

if docker compose version &> /dev/null; then
    docker compose up --build
elif docker-compose --version &> /dev/null; then
    docker-compose up --build
else
    echo "❌ Erro: Nem 'docker compose' nem 'docker-compose' foram encontrados."
    echo "Certifique-se de que o plugin Compose está instalado."
    exit 1
fi
