import { ClientConcreteValues } from "../../types";
import md5 from "md5";

export function avatarSrc(client: ClientConcreteValues, size = 128) {
    const nameImg = `https://ui-avatars.com/api/
        ?name=${client.firstName}+${client.lastName}&rounded=true&background=318335&color=ffffff&size${size}`;
    
    if (!client.email)
        return nameImg;
    
    return `https://www.gravatar.com/avatar/${md5(client.email.trim())}?d=${encodeURIComponent(nameImg)}`;
}
