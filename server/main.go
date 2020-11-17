package main

import (
	"context"
	"flag"
	"fmt"
	"socrates/pb"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"google.golang.org/grpc"
)

var (
	addr        string
	port        string
	apiLocation string
)

func init() {
	flag.StringVar(&addr, "server", "127.0.0.1:9999", "gRPC server address")
	flag.StringVar(&port, "port", "8080", "API Port")
	flag.Parse()
	apiLocation = fmt.Sprintf(":%s", port)
}

type AskRequest struct {
	Passage   string   `json:"passage"`
	Questions []string `json:"questions"`
}

func handleAsk(c *gin.Context) {

	var req AskRequest
	if c.ShouldBindJSON(&req) == nil {
		conn, err := grpc.Dial(addr, grpc.WithInsecure())
		if err != nil {
			c.JSON(500, gin.H{
				"error": err,
			})
			return
		}
		defer conn.Close()

		client := pb.NewSocratesClient(conn)
		req := pb.SocratesRequest{
			Passage:   req.Passage,
			Questions: req.Questions,
		}

		resp, err := client.Ask(context.TODO(), &req)
		if err != nil {
			fmt.Println(err)
			c.JSON(406, gin.H{
				"error": err,
			})
			return
		}
		c.JSON(200, gin.H{
			"answers": resp.Answers,
		})

	} else {
		c.String(406, "Malformed request")
	}
}

func main() {
	gin.SetMode(gin.ReleaseMode)
	route := gin.Default()
	config := cors.DefaultConfig()

	config.AllowAllOrigins = true

	route.Use(cors.New(config))

	route.Use(static.Serve("/client", static.LocalFile("./client/build", true)))
	route.POST("/mrc", handleAsk)
	route.Run(apiLocation)
}
