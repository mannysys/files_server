/**
 * Created by zhoujialin on 2016/4/22.
 */
'use strict';
//����ģ��
const http = require('http');
const fs = require('fs');
const url = require('url');
const mime = require('mime');  // ���ڴ����ļ��� Conten-Type ��װģ�飺npm install mime

//����������StaticServer��
module.exports = class StaticServer{

    //���캯��
    constructor(options){
        this.currentServer = null;  // http����
        this.options = {
            port: 1337,                 // �����������Ķ˿�
            host: '127.0.0.1',          // ������������ ip
            filePath: './public',       // ��̬�ļ���Ŀ¼
            homePage: '/index.html'     // ָ����ҳ�ļ�
        };
        // �Ѵ��빹�캯���Ĳ����е�ֵ���뵽options��
        for(let key in options){
            this.options[key] = options[key];
        }
    }

    // ��������������
    run(){
        let self = this;

        // ͨ�� http.createServer ���� http ����
        this.currentServer = http.createServer((req, res) => {
            // �����ͻ���������ʵ� url ��ַ
            let tmpUrl = url.parse(req.url).pathname;
            // ����û����ʵ��� '/' ��ҳ�����Զ�ָ����ȡ��ҳ�ļ���Ĭ���� 'index.html'
            let reqUrl = tmpUrl === '/' ? self.options.homePage : tmpUrl;
            let filePath = self.options.filePath + reqUrl; // ��װ�ļ���ַ

            // Promise ֧����ʽ����
            // ������ʹ������߼���������
            // �����ز��Ƕ�׻ص�����
            // Promise ��ʽ���õ�������
            // ÿ�� then() ������ return һ�� Promise ����
            // ������ܸ��ŵ��� then() �������� catch() ����
            // catch() ����ҲҪ return һ�� Promise ����
            // ������ܽ��ŵ��� then() �������� catch() ����

            // ����ļ��Ƿ����
            self.checkFilePromise(filePath).then(() => {
                // �ļ��������Զ�ȡ�ļ�
                return self.readFilePromise(filePath);
            }).then((data) => {
                // �ļ���ȡ�ɹ�
                // �����ļ�����
                self.sendData(res, data, reqUrl);
            }).catch(() => {
                // ͳһ�������
                // �ļ������ڻ��߶�ȡʧ��
                self.catch404(res);
            });

        }).listen(this.options.port, this.options.host, () => {
            console.log('Server is running on ' + this.options.host + ':' + this.options.port);

        });

    }

    // �رշ���
    close(){
        this.currentServer.close(() => {
           console.log('Server closed.');
        });
    }

    // �����ļ�����
    sendData(res, data, url){
        res.writeHead(200, { 'Content-Type': mime.lookup(url) });
        res.write(data);
        res.end();
    }

    // ����404����
    catch404(res) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('Error 404. Resource not found.');
        res.end();
    }

    // ʹ�� promise ��װ��ȡ�ļ��ķ���
    readFilePromise(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    // ʹ�� promise ��װ���ļ��Ƿ�ɶ�ȡ�ķ���
    // fs.access ���ڼ���ļ��Ƿ�ɶ�ȡ
    checkFilePromise(path) {
        return new Promise((resolve, reject) => {
            fs.access(path, fs.R_OK, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve('success');
                }
            });
        });
    }



}




























