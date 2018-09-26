import config from 'config';

import staticAddress from '../../pack/address.json';

export default async (ctx, next) => {
	await ctx.render('index', {
    title: config['domain'],
    jsList: staticAddress.js,
    cssList: staticAddress.css
	});
}
