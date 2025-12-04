package models

type ServiceAgent struct {
	Service     string   `json:"service"`
	Version     string   `json:"version"`
	Tags        []string `json:"tags"`
	Hostname    string   `json:"hostname"`
	IP          string   `json:"ip"`
	Machine     string   `json:"machine"`
	Environment string   `json:"environment"`
	Logging     string   `json:"logging"`
}
