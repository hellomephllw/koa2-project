module.exports = function() {
    return async (ctx, next) => {
        const allowDomains = [
            'http://localhost:3000',
            'localhost:3000',
            'http://localhost:3333',
            'localhost:3333',
        ];
        const allowOrigin = (function() {
            let host = ctx.request.get('host');
            let origin = ctx.request.get('origin');

            for (let i = 0, len = allowDomains.length; i < len; ++i) {
                let allowDomain = allowDomains[i];
                if (host === allowDomain || origin === allowDomain) return allowDomain;
            }
        }());

        if (allowOrigin) {
            ctx.response.set('Access-Control-Allow-Origin', allowOrigin);
            ctx.response.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
            ctx.response.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
            ctx.response.set('Access-Control-Allow-Credentials', 'true');

            if (ctx.request.method === 'OPTIONS') {//让options请求快速返回
                ctx.response.status = 200;
            } else {
                await next();
            }
        } else {
            await next();
        }
    };
};