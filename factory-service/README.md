# Factory App

## Routes

+ author
+ user
+ redis key / value
+ book (local file)
+ message queue
+ github user
+ post
+ student (mongodb)

```golang
go run main.go -u=admin -p=123456 par1 par2 par3
```

```docker
docker run --rm -it -v $pwd:/home/go-app  --name test golang bash
docker run -d -p -memory --cpu-shares --name --network none/host

go test ./add
go test ./**/ -v
```

```golang
counter++
message := fmt.Sprintf("hello, rabbitmq %d", counter)
ProduceMessage(Options{queue: "hello", message: message})
```

```golang
package apps

import (
	"fmt"
	"log"
	"net/http"
)

const port int = 8000

func defaultHandler2(response http.ResponseWriter, request *http.Request) {
	fmt.Fprintf(response, "welcome to golang demo")
}

func healthHandler(response http.ResponseWriter, request *http.Request) {
	fmt.Fprintf(response, "Healthy")
}

func valuesHandler(response http.ResponseWriter, request *http.Request) {
	fmt.Fprintf(response, "TODO for /api/values")
}

func RunHttpServer() {
	http.HandleFunc("/", defaultHandler2)
	http.HandleFunc("/health", healthHandler)
	http.HandleFunc("/api/values", valuesHandler)
	log.Printf("server is running at %d\n", port)
	http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
}

```