# -*-conf-*-

location ~ "^/ngx_pagespeed_static/" {}
location ~ "^/ngx_pagespeed_beacon$" {}
location ~ "\.pagespeed\.([a-z]\.)?[a-z]{2}\.[^.]{10}\.[^.]+" { add_header "" ""; }

# location /ngx_pagespeed_statistics { allow 127.0.0.1; deny all; }
# location /ngx_pagespeed_global_statistics { allow 127.0.0.1; deny all; }
# location /ngx_pagespeed_message { allow 127.0.0.1; deny all; }
# location /pagespeed_console { allow 127.0.0.1; deny all; }

location /ngx_pagespeed_statistics { }
location /ngx_pagespeed_global_statistics { }
location /ngx_pagespeed_message { }
location /pagespeed_console { }
