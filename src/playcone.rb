require 'sinatra/base'
require 'open3'
require 'json'

class PlayCone < Sinatra::Base
  get "/" do
	send_file File.expand_path('index.html', settings.public_folder)
  end
	
  post "/evaluate.json" do
	# extract and save the code from JSON payload
	request.body.rewind
	body = JSON.parse request.body.read
	File.open("play/test.cone", 'w') { |file| file.write(body['code']) }
	
	# The list of scripted commands to execute
    cmds = [
	  "cone/cone -oplay/ play/test.cone",
	  "gcc -c play/main.c -o play/main.o",
	  "gcc -o play/main play/main.o play/test.o",
	  "timeout 15s play/main"]
	
	rc = 0
	prog_out = ""
	conec_err = ""
	
	# Perform them, one after another, capturing the results. Stop on first fail
	ENV['PATH'] = "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
	cmds.each do |cmd|
	  if rc == 0
		stdout, stderr, status = Open3.capture3(cmd)
		rc = status.exitstatus
		if rc == 0
		  prog_out = stdout
		else
		  conec_err = stderr
		end
	  end
	end
	

	if rc == 0
		output = {'conec' => conec_err, 'program' => prog_out}
	else
		output = {'conec' => conec_err}
	end
	response = JSON.generate(output)
	content_type :json
	response
  end
  
  post "/compile.json" do
	# extract and save the code from JSON payload
	request.body.rewind
	body = JSON.parse request.body.read
	File.open("play/test.cone", 'w') { |file| file.write(body['code']) }
	resultfile = body['emit'] == 'asm' ? "play/test.s" : "play/test.ir"
	
	# The list of scripted commands to execute
    cmds = [
	  "cone/cone --asm --llvmir -oplay/ play/test.cone",
	]
	rc, stdout, error = docmds(cmds)

	if rc == 0
		output = {'result' => File.read(resultfile)}
	else
		output = {'error' => error}
	end
	response = JSON.generate(output)
	content_type :json
	response
  end
end

def docmds(cmds)
	rc = 0
	prog_out = ""
	conec_err = ""
	
	# Perform them, one after another, capturing the results. Stop on first fail
	ENV['PATH'] = "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
	cmds.each do |cmd|
	  if rc == 0
		stdout, stderr, status = Open3.capture3(cmd)
		rc = status.exitstatus
		if rc == 0
		  prog_out = stdout
		else
		  conec_err = stderr
		end
	  end
	end
	
	return rc, prog_out, conec_err
end
