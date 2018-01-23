require 'sinatra/base'
require 'open3'
require 'json'

class PlayCone < Sinatra::Base
  get "/" do
	send_file File.expand_path('index.html', settings.public_folder)
  end
	
  get "/run" do
    # The list of scripted commands to execute
    cmds = [
	  "cone/cone -oplay/ play/test.cone",
	  "gcc -c play/main.c -o play/main.o",
	  "gcc -o play/main play/main.o play/test.o",
	  "play/main"]
	
	rc = 0
	response = ""
	
	# Perform them, one after another, capturing the results. Stop on first fail
	ENV['PATH'] = "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
	cmds.each do |cmd|
	  if rc == 0
		stdout, stderr, status = Open3.capture3(cmd)
		rc = status.exitstatus
		if rc == 0
		  response = stdout
		else
		  response = stderr
		end
	  end
	end
	
	# Add env variables to output for diagnostic purposes
	response += "<br/><br/>\r\n"
    request.env.each_pair do |k, v|
        response += "#{k} = \"#{v}\"<br/>\r\n"
    end
	
	File.open("response.log", 'w') { |file| file.write(response) }
	
	response
  end

  post "/evaluate.json" do
    response = ""
    request.env.each_pair do |k, v|
        response += "#{k} = \"#{v}\"<br/>\r\n"
    end
	request.body.rewind
	body = JSON.parse request.body.read
	response += "\r\n" + body['code']
	
	File.open("response.log", 'w') { |file| file.write(response) }
	
	response
  end
end
