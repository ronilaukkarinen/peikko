        var connect_chars = "·oOo· ";
        var connect_index = -1;
        var connecting = true;
        var im_hiding_behind_my_facebokk = false;
        var bar_char = "|";
        var cpu_bar_length = 55;
        var cpu_bar_height = 15;
        var cpu_bars = [];
        var cpu_amount = 0;
        var cpu_time_bar_length = 40;
        var mem_bar_length = 55;
        var swap_bar_length = mem_bar_length;
        var boot_time = 0;
        var version = "";
        var io_net_in = 0;
        var io_net_out = 0;
        var io_disk_in = 0;
        var io_disk_out = 0;

        String.prototype.repeat = function(num)
        {

if (isNaN(num)) return '';

            num = Math.round(num);

            if (num <= 0) {
                return "";
            }


            return new Array(num + 1).join(this);

        };

        function pad(str, length, filler) {
            if (typeof(filler) === "undefined") {
                filler = " ";
            }

            str = String(str);

            if (str.length >= length) {
                return str;
            }
            else {
                return str + filler.repeat(length - str.length);
            }
        }

        function draw_connecting() {
            if (connecting) {
                ++connect_index;
                if (connect_index >= connect_chars.length) {
                    connect_index = 0;
                }

                $('#connecting').text(connect_chars[connect_index] + " ");
                im_hiding_behind_my_facebokk = false;
            }
            else if (!im_hiding_behind_my_facebokk) {
                $('#connecting').hide();
                im_hiding_behind_my_facebokk = true;
            }

            current_time = (new Date).getTime() / 1000;
            interval = current_time - boot_time;

            days = Math.floor(interval / 86400);
            hours = Math.floor((interval - (days * 86400)) / 3600);
            minutes = Math.floor((interval - (days * 86400) - (hours * 3600)) / 60);
            seconds = Math.floor(interval - (days * 86400) - (hours * 3600) - (minutes * 60));

            $('#uptime').text("" + days + "d " + hours + "h " + minutes + "m " + seconds + "s");
        }

        function bar(percent, max_length) {
            var bar_str = bar_char.repeat(max_length * (percent / 100));
            return pad(bar_str, max_length);
        }

        function hb(bytes, round) {
            if (typeof(round) === "undefined") {
                round = 2;
            }

            if (bytes <= 0) {
                return "0 B";
            }

            var kilo = 1000;
            var prefixes = [
                [Math.pow(kilo, 4), 'T'],
                [Math.pow(kilo, 3), 'G'],
                [Math.pow(kilo, 2), 'M'],
                [kilo, 'k']
            ];

            for (var i = 0; i < prefixes.length; ++i) {
                if (bytes >= prefixes[i][0]) {
                    return "" + (bytes / prefixes[i][0]).toFixed(2) + " " + prefixes[i][1] + "B";
                }
            }

            return "" + bytes + " B";
        }

        function connect() {
            return $.gracefulWebSocket("ws://peikko.us:2221");
        }

        setInterval(draw_connecting, 1000);
        var ws = connect();

        ws.onopen = function() {
            connecting = false;
        };

        ws.onclose = function() {
            connecting = true;

            ws = connect();
        };

        ws.onerror = ws.onclose;

        ws.onmessage = function (event) {
            var json = $.parseJSON(event.data);

            if (json.boot !== undefined) {
                boot_time = json.boot;
                cpu_amount = json.cpus;
                version = json.version;

                $('#version').text(version);

                for (var i = 0; i < cpu_amount; ++i) {
                    cpu_bars.push([]);

                    new_div = $('<div />');
                    new_div.addClass("cpu p");
                    new_div.attr({id: "cpu" + i});
                    $('#cpu').append(new_div);
                }
            }
            else {
                // CPU BARS
                var cpu_bar_chars = [];
                for (var cpu = 0; cpu < cpu_amount; ++cpu) {
                    new_val = json.cpu[cpu];
                    var cbar = cpu_bars[cpu];
                    var chars = [];

                    cbar.push(new_val);
                    if (cbar.length > cpu_bar_length) {
                        cbar.shift();
                    }

                    for (var i = 0; i < cbar.length; ++i) {
                        chars.push(bar(cbar[i], cpu_bar_height));
                    }

                    var output = "";
                    var legend = "CPU" + cpu + " " + Math.round(new_val) + "%";
                    // Draw bar chart by transposing
                    for (var y = 0; y < cpu_bar_height; ++y) {
                        for (var x = 0; x < cpu_bar_length; ++x) {
                            // Draw legend
                            if (y == 0 && x < legend.length) {
                                output += legend[x];
                            }
                            else {
                                var cell = undefined;
                                var column = chars[x];

                                if (column !== undefined) {
                                    cell = column[cpu_bar_height-y-1];
                                }

                                if (cell === undefined) {
                                    output += "";
                                }
                                else {
                                    output += cell;
                                }
                            }
                        }
                        output += "\n";
                    }

                    $('#cpu' + cpu).text(output);
                }



                // CPU TIMES
                var ct = json.cpu_times;
                $('#cpu_time_values').text("" +
                    pad(Math.round(ct.user), 3) + "\n" +
                    pad(Math.round(ct.system), 3) + "\n" +
                    pad(Math.round(ct.idle), 3) + "\n" +
                    pad(Math.round(ct.nice), 3) + "\n" +
                    pad(Math.round(ct.iowait), 3) + "\n" +
                    pad(Math.round(ct.irq), 3) + "\n" +
                    pad(Math.round(ct.softirq), 3) + "\n" +
                    pad(Math.round(ct.steal), 3) + "\n" +
                    pad(Math.round(ct.guest), 3) + "\n" +
                    pad(Math.round(ct.guest_nice), 3)
                    );
                $('#cpu_time_bars').text("" +
                    bar(ct.user, cpu_time_bar_length) + "\n" +
                    bar(ct.system, cpu_time_bar_length) + "\n" +
                    bar(ct.idle, cpu_time_bar_length) + "\n" +
                    bar(ct.nice, cpu_time_bar_length) + "\n" +
                    bar(ct.iowait, cpu_time_bar_length) + "\n" +
                    bar(ct.irq, cpu_time_bar_length) + "\n" +
                    bar(ct.softirq, cpu_time_bar_length) + "\n" +
                    bar(ct.steal, cpu_time_bar_length) + "\n" +
                    bar(ct.guest, cpu_time_bar_length) + "\n" +
                    bar(ct.guest_nice, cpu_time_bar_length)
                    );



                // I/O
                var net_in_diff = json.net.bytes_in - io_net_in;
                var net_out_diff = json.net.bytes_out - io_net_out;
                var disk_in_diff = json.disk.read_count - io_disk_in;
                var disk_out_diff = json.disk.write_count - io_disk_out;

                io_net_in = json.net.bytes_in;
                io_net_out = json.net.bytes_out;
                io_disk_in = json.disk.read_count;
                io_disk_out = json.disk.write_count;



                $('#io_values').text(pad("", 20) + "\n" +
                    hb(json.net.bytes_in) + " (" + hb(net_in_diff) + ")\n" +
                    hb(json.net.bytes_out) + " (" + hb(net_out_diff) + ")\n" +
                    "\n" +
                    "\n" +
                    json.disk.read_count + " (" + disk_in_diff + ")\n" +
                    json.disk.write_count + " (" + disk_out_diff + ")"
                    );



                // MEMORY
                var mem_str = "Mem  " + bar(json.mem, mem_bar_length);
                var swap_str = "Swap " + bar(json.swap, swap_bar_length);

                var mem_end = "" + json.mem + " %";
                var swap_end = "" + json.swap + " %";
                mem_str = mem_str.substr(0, mem_str.length - mem_end.length) + mem_end;
                swap_str = swap_str.substr(0, swap_str.length - swap_end.length) + swap_end;

                $('#virt').text(mem_str);
                $('#swap').text(swap_str);



                // MISC
                $('#users').text(json.users);
                $('#processes').text(json.procs);
            }
        };
