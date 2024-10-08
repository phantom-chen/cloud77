package controllers

import "net"

func GetIPAddress() string {
	addr := ""
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		println(err)
	} else {

		for _, v := range addrs {
			ipnet, ok := v.(*net.IPNet)
			if ok && !ipnet.IP.IsLoopback() && ipnet.IP.To4() != nil && ipnet.IP.IsPrivate() {
				println(ipnet.IP.IsGlobalUnicast())
				println(ipnet.Network())
				println(ipnet.String())
				if addr == "" {
					addr = ipnet.IP.String()
				}
			}
		}
	}
	return addr
}
