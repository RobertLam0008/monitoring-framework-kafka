# How to Run

Required to manually install Kafka (not included in this repository).

Start zookeeper then kafka.
	- bin/windows/zookeeper-server-start.bat config\zookeeper.properties
	- bin/windows/kafka-server-start.bat config\server.properties

Create topic.

	- bin\windows\kafka-topics.bat --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic test2

in h2vizReact:
 Run react project.
	- yarn start
 Run node test-kafka-sse.js.

InfluxDB:
Go to influxdb-viz
  Run test-write.js (will stream CSV data to influxDB TestBucket)
  Run test-read.js  (will read data to console log).
  Run test-producer.js (send data to WS proxy from kafka)