/* eslint max-nested-callbacks: off */
/* eslint-env mocha */
/* global expect */

// import _              from 'lodash';
// import angular        from 'angular';
// import 'angular-mocks';

// import $              from 'jquery';
// import WindowOnScroll from './index';

// describe('WindowOnScroll 组件', function () {
//   const { module, inject } = angular.mock;

//   beforeEach(function () {
//     // 初始化WindowOnScroll组件
//     module(WindowOnScroll);

//     // 清场
//     document.body.innerHTML = '';
//   });

//   describe('结构规范', function () {
//     it('会返回组件名称', function () {
//       expect(WindowOnScroll).to.be.a('string');
//     });

//     it('能进行初始化', function () {
//       inject(function ($rootScope, $compile) {
//         let $element = $compile('<div window-onscroll><div>')($rootScope.$new());
//         angular.element(document.body).append($element);
//         let $jqWindowOnscroll = $('[window-onscroll]');

//         expect($jqWindowOnscroll.hasClass('active')).to.be.true;
//       });
//     });
//   });

//   describe('触发流程', function () {
//     it('滚动窗口更改class', function (done) {
//       inject(function ($rootScope, $compile) {
//         let $element = $compile('<div window-onscroll start-y="40" style="height: 20000px;">test<div>')($rootScope.$new());
//         angular.element(document.body).append($element);
//         let $jqWindowOnscroll = $('[window-onscroll]');

//         expect($jqWindowOnscroll.hasClass('active')).to.be.false;

//         window.scroll(0, 1000);
//         $(window).trigger('scroll');
//         setTimeout(function () {
//           console.log(window.scrollY);
//           console.log(window.innerHeight);
//           console.log($(document.body).height());
//           expect($jqWindowOnscroll.hasClass('active')).to.be.true;
//           done();
//         }, 10);
//       });
//     });
//   });
// });
