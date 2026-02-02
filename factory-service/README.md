# Factory Service

Mongodb

- Author
- Student
- Author
- User

MySQL

- Tester

File

- Post
- Book

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

```golang
package handlers

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
)

func bookHandler1(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("foo", "bar1")
	w.Header().Add("foo", "bar2")

	w.WriteHeader(200)

	a := strings.SplitN(r.URL.Path, "/", 3)
	fmt.Println(len(a))
	for _, v := range a {
		fmt.Println(v)
	}
	fmt.Println(a)

	book_id := a[2]
	fmt.Println(book_id)
	io.WriteString(w, time.Now().Format("2006-01-02 11:11:11"))
}

func booksHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("foo", "bar1")
	w.WriteHeader(200)

	ids, ok := r.URL.Query()["id"]
	if ok {
		fmt.Printf("book id is %s\n", ids[0])
	}

	books := getBooks()
	d, err := json.Marshal(&books)
	if err != nil {
		fmt.Println(err.Error())
	}

	if r.Method == "POST" {
		bd, err := ioutil.ReadAll(r.Body)
		if err != nil {
			log.Fatal(err)
		} else {
			fmt.Println(string(bd))
		}
		w.Write(d)
	} else {
		fmt.Fprintf(w, `{"book1":"hello"}`)
		w.Write(d)
	}
}
```