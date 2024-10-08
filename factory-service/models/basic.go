package models

import (
	"context"
	"errors"
	"fmt"
	"io"
	"io/fs"
	"os"
	"strings"
)

var ctx = context.Background()

func FileExisting(name string) bool {
	_, err := os.Stat(name)

	if os.IsNotExist(err) {
		return false
	} else {
		return true
	}
}

func FolderExisting(name string) bool {
	_, err := os.Stat(name)

	if os.IsNotExist(err) {
		return false
	} else {
		return true
	}
}

func GetContent(file string) ([]byte, error) {

	if !FileExisting(file) {
		return nil, errors.New("file not exists")
	}

	f, err := os.Open(file)
	if err != nil {
		return nil, err
	}

	defer f.Close()

	data, err := io.ReadAll(f)
	if err != nil {
		return nil, err
	}

	return data, nil
}

func Array2string(tags []string) string {
	if len(tags) > 0 {
		return strings.Join(tags, ",")
	} else {
		return ""
	}
}

func GetFiles() {
	entries, err := os.ReadDir("data/posts")
	if err != nil {
	}
	infos := make([]fs.FileInfo, 0, len(entries))
	for _, entry := range entries {
		info, err := entry.Info()
		if err != nil {
		}
		infos = append(infos, info)
		if !info.IsDir() {
			fmt.Println(info.Name())
		}
	}
	fmt.Println(infos)
}
