#!/usr/bin/ruby
require 'open3'

stdout, stderr, status = Open3.capture3("../cone/cone test.cone")
if status.exitstatus != 0

  puts stderr

else

  `cc -c main.c`
  `cc -o main main.o test.o`
  
  stdout, stderr, status = Open3.capture3("./main")
  puts stdout

end
