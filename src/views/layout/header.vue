<template>
  <header class="app-header">
    <img
      class="header-logo"
      src="https://yangyuji.github.io/h5-factory/static/img/logo.png"
    />h5-factory
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
};
</script>

<style lang="scss" scoped>
.app-header {
  position: relative;
  height: 60px;
  line-height: 60px;
  padding-left: 20px;
  background: rgba(38, 38, 38, 1);
  font-size: 18px;
  color: #fff;

  .header-logo {
    display: inline-block;
    width: 30px;
    height: 30px;
    vertical-align: middle;
    margin-right: 15px;
  }
}
</style>
