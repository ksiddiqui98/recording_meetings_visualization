import commHandler


comm = commHandler.commHandler()
comm.send('amq.topic', 'abc', '{"users":["0","1","2","3","4","5"],"speech":"this is a test","time":2,"userID":"0"}')
