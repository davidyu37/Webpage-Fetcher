# Webpage Fetcher README

Welcome to the Webpage Fetcher application! This guide will help you build and run a Docker container for the Webpage Fetcher, allowing you to either fetch a webpage's HTML content or create a local mirror of it, including all its assets.

## Prerequisites

Before you begin, ensure you have Docker installed on your system. Visit the [official Docker documentation](https://docs.docker.com/get-docker/) for installation instructions specific to your operating system.

## Installation

1. **Clone the Repository**

   If the application's source code is hosted on a repository, start by cloning it to your local machine. If you already have the source code, you can skip this step.

   ```bash
   git clone https://github.com/davidyu37/Webpage-Fetcher.git
   cd Webpage-Fetcher
   ```

2. **Build the Docker Image**

Within the directory containing the Dockerfile, build the Docker image using:

```bash
docker build -t webpage-fetcher .
```

## Running the Application

The Webpage Fetcher can be run in two modes:

- **Default Mode** - Fetches the HTML content of a specified webpage.
- **Mirror Mode** - Creates a local mirror of the specified webpage, including all assets.

### Default Mode

To fetch the HTML content of a webpage, simply run:

```bash
docker run webpage-fetcher node . https://www.google.com
```

Replace https://www.google.com with the target webpage URL.

### Mirror Mode

To create a local mirror of a webpage, use the following command:

```bash
docker run webpage-fetcher node mirror-copy.js https://www.google.com
```

Replace https://www.google.com with the target webpage URL.

### Saving Output Locally

```bash
docker run -v "$(pwd)":/app webpage-fetcher node . https://www.google.com
```

or

```bash
docker run -v "$(pwd)":/app webpage-fetcher node mirror-copy.js https://www.google.com
```
