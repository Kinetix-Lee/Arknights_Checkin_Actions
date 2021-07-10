import os

def info(message):
  print('[I] ', message)

def success(message):
  print('[S] ', message)

def error(err):
  print('[E] ', err)

def halt(err):
  error(err)
  os._exit() # “丢人，你马上给我退出战场。”  ——凛冬