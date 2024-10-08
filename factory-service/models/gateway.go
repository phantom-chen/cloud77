package models

type DefaultResponse struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Id      string `json:"id"`
}

type ServiceApp struct {
	Name     string   `json:"name"`
	Version  string   `json:"version"`
	Tags     []string `json:"tags"`
	Hostname string   `json:"hostname"`
	IP       string   `json:"ip"`
}
