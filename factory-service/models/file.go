package models

import (
	"errors"
	"fmt"
	"io"
	"io/fs"
	"os"
)

func FileExisting(path string) bool {
	_, err := os.Stat(path)

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

func GetContent(path string) ([]byte, error) {

	if FileExisting(path) {
		f, err := os.Open(path)
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

	return nil, errors.New("file not exists")
}

func WriteFile(name string, content string) {
	os.WriteFile(name, []byte(content), 0666)
}

func GetFiles(path string) {
	entries, err := os.ReadDir(path)
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
