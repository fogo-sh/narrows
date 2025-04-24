package main

import (
	"log/slog"
	"os"

	"github.com/fogo-sh/narrows/pkg/config"
	"github.com/fogo-sh/narrows/pkg/database"
	"github.com/fogo-sh/narrows/pkg/web"
)

func main() {
	err := config.Load()
	if err != nil {
		slog.Error("Error loading config", "error", err)
		os.Exit(1)
	}

	database.Initialize(config.Instance.DBPath)

	webServer, err := web.New()
	if err != nil {
		slog.Error("Error creating web server", "error", err)
		os.Exit(1)
	}

	err = webServer.Run()
	if err != nil {
		slog.Error("Error running web server", "error", err)
		os.Exit(1)
	}
}
