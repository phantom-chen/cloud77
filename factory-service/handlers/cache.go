package handlers

import (
	"encoding/json"
	"factory/models"
	"fmt"
	"io"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
)

func PingCache(c *gin.Context) {
	r, _ := models.PingRedisClient()
	fmt.Println(r)

	c.JSON(200, gin.H{
		"message": r,
	})
}

func GetCache(c *gin.Context) {
	key := c.Param("key")
	val, err := models.GetCache(key)

	if err != nil {
		if err == redis.Nil {
			c.JSON(404, gin.H{
				"message": "found no redis cache for " + key,
			})
		} else {
			c.JSON(404, gin.H{
				"message": "fail to get redis cache",
			})
		}
	} else {
		c.JSON(200, gin.H{
			"cache": val,
		})
	}
}

func AddCache(c *gin.Context) {
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		fmt.Println(err.Error())
		c.JSON(400, gin.H{
			"message": "please put your body",
		})
	} else {
		fmt.Println(string(body))
		var item models.CacheItem
		json.Unmarshal(body, &item)
		fmt.Println(item.Key)
		fmt.Println(item.Value)
		fmt.Println(item.ExpireInHour)
		err := models.AddCache(item.Key, item.Value)
		if err != nil {
			c.JSON(400, gin.H{})
		} else {
			c.JSON(200, gin.H{
				"message": "wip",
			})
		}

	}
}
