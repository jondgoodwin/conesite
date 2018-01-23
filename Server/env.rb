#!/usr/bin/ruby

print "Content-type: text/plain\n\n"

ENV.each_pair do |k, v|
  print "#{k} = \"#{v}\"\n"
end
