package models

import "encoding/json"

type FactorySetting struct {
	Port          string `json:"port"`
	Service       string `json:"service"`
	Database      string `json:"database"`
	Secret        string `json:"secret"`
	ExpiresInHour int    `json:"expiresInHour"`
}

var _setting *FactorySetting

func getSetting() (FactorySetting, error) {
	var setting FactorySetting
	if _setting != nil {
		setting = *_setting
		return setting, nil
	}

	data, err := GetContent("./factory.json")
	if err != nil {

	} else {
		json.Unmarshal(data, &setting)
		_setting = &setting
	}

	return setting, err
}

func GetDatabaseName() string {
	setting, err := getSetting()
	if err != nil {
		return ""
	} else {
		return setting.Database
	}
}

func GetSecret() string {
	setting, err := getSetting()
	if err != nil {
		return ""
	} else {
		return setting.Secret
	}
}
