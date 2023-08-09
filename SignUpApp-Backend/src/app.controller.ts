import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Mnemonic } from '@hashgraph/sdk';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('create')
  async createAccount(@Body() mnemonics: Mnemonic): Promise<any> {
    try{
      var account = await this.appService.createAccount(mnemonics);
      return account;
    } catch (error) {
      return {
        error: 'Error creating account.'
      }
    }
  }
}
