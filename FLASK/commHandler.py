# -*- coding: utf-8 -*-

import pika
import threading



LOCALHOST = 'localhost'
#SERVER_IP = '129.161.106.38'
SERVER_IP = '128.113.21.81'
# QUEUES
# SpatialContext.registry
# SpatialContext.command.boss
# SpatialContext.command.worker






class commHandler:
    
    def __init__(self, ip=SERVER_IP):
        credentials = pika.PlainCredentials('guest', 'guest')
        parameters = pika.ConnectionParameters(ip, 5672, '/', credentials, heartbeat_interval=0)
        self.connection = pika.BlockingConnection(parameters)
        self.SendChannel = self.connection.channel()
        self.ReceiveChannel = self.connection.channel()
    
    
    def send(self, exchange, routing, content):
        # exchange
        if 'fanout' in exchange:
            self.SendChannel.exchange_declare(exchange=exchange, exchange_type='fanout', durable=True)
        elif 'direct' in exchange:
            self.SendChannel.exchange_declare(exchange=exchange, exchange_type='direct', durable=True)
        elif 'topic' in exchange:
            self.SendChannel.exchange_declare(exchange=exchange, exchange_type='topic', durable=True)  
        else:
            exchange = ''
        # binding
        self.SendChannel.basic_publish(exchange=exchange,
                                      routing_key=routing,
                                      body=content)


    def __consumer__(self, exchange, routing, callback):
        # exchange
        if 'fanout' in exchange:
            self.ReceiveChannel.exchange_declare(exchange=exchange, exchange_type='fanout', durable=True)
        elif 'direct' in exchange:
            self.ReceiveChannel.exchange_declare(exchange=exchange, exchange_type='direct', durable=True)
        elif 'topic' in exchange:
            self.ReceiveChannel.exchange_declare(exchange=exchange, exchange_type='topic', durable=True)  
        else:
            exchange = ''
        # queue
        result = self.ReceiveChannel.queue_declare(exclusive=True)
        queue = result.method.queue
        # binding
        if '' == exchange:
            print(' [*] The queue binds to the default exchange')
        else:
            self.ReceiveChannel.queue_bind(exchange=exchange, 
                                    queue=queue,
                                    routing_key=routing)
            print(' [*] The queue binds to ' + exchange)
        print(' [*] Listening to routing: ' + routing)
        self.ReceiveChannel.basic_consume(callback, queue=queue, no_ack=True)
        self.ReceiveChannel.start_consuming()

    
    def listen(self, exchange, routing, callback):
        consumer_thread = threading.Thread(target=self.__consumer__, args=[exchange, routing, callback])
        consumer_thread.start()
        
    
    def close(self):
        self.connection.close()
        self.connection = None




