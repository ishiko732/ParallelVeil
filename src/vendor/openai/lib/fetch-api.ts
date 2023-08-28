'use strict';
import fetch, {RequestInit, Response} from "node-fetch";
import {ProxyAgent, ProxyAgentOptions} from "proxy-agent";

export default async function fetchApi(url: string, option?: RequestInit, proxyOpts?: ProxyAgentOptions): Promise<Response> {
    const agent = new ProxyAgent(proxyOpts);
    return fetch(url, {agent, ...option});
};