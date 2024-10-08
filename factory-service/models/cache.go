package models

import (
	"time"

	"github.com/go-redis/redis/v8"
)

type CacheItem struct {
	Key          string `json:"key"`
	Value        string `json:"value"`
	ExpireInHour int16  `json:"expireInHour"`
}

var redisClient *redis.Client

func getClient() redis.Client {
	if redisClient != nil {
		return *redisClient
	} else {
		addr, pwd, db := GetRedisSettings()
		redisClient = redis.NewClient(&redis.Options{
			Addr:     addr,
			Password: pwd,
			DB:       db,
		})
		return *redisClient
	}
}

func PingRedisClient() (string, error) {
	client := getClient()
	return client.Ping(ctx).Result()
}

func GetCaches(pattern string) ([]string, error) {
	client := getClient()
	values, err := client.Keys(ctx, pattern).Result()

	if err != nil {
		return nil, err
	} else {
		return values, nil
	}
}

func GetCache(key string) (string, error) {
	client := getClient()
	return client.Get(ctx, key).Result()
}

func AddCache(key string, value string) error {
	client := getClient()
	status := client.Set(ctx, key, value, time.Second*60*60)
	if status.Err() != nil {
		return status.Err()
	} else {
		return nil
	}
}

func DeleteCache(key string) int64 {
	client := getClient()
	return client.Del(ctx, key).Val()
}
