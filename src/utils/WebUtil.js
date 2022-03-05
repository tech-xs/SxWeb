import global from "@/core/global";

export function setIcon() {
    //设置网站图标
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = global.web.resource.root + global.web.icon;
    document.getElementsByTagName('head')[0].appendChild(link);
}