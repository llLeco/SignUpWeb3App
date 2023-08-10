import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HederaService, IUser, IHWalletDTO } from '../services/hedera.service';
import { Mnemonic, PrivateKey } from '@hashgraph/sdk';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { LoadingController } from '@ionic/angular';
import { of } from 'rxjs';
import * as bcrypt from 'bcryptjs';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(600, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate(200, style({ opacity: 0 }))
      ])
    ]),
    trigger('cardSwap', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ])
    ])
  ],
})
export class RegisterPage implements OnInit {

  // Form Groups
  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required], [this.usernameValidator.bind(this)]),
    email: new FormControl('', [Validators.required, Validators.email], [this.emailValidator.bind(this)]),
    password: new FormControl('', [Validators.required, this.passwordStrengthValidator.bind(this)]),
    passwordConfirm: new FormControl('', Validators.required),
  }, { validators: this.passwordMatchValidator });

  importWalletForm = new FormGroup({
    walletId: new FormControl('', [Validators.required]),
    mnemonic: new FormControl(['']),
    privateKey: new FormControl('')
  });

  // User-related variables
  userRegisterData: { walletId: string, username: string, email: string, password: string} = { walletId: '', username: '', email: '', password: ''};
  showWalletData: {
    mnemonic: any, privateKey: string, publicKey: string, accountId: string, walletName: string, walletPassword: string, walletNet: string,
  } = { mnemonic: [], privateKey: '', publicKey: '', accountId: '', walletName: '', walletPassword: '', walletNet: '' };
  importMethod: 'mnemonic' | 'privateKey' = 'mnemonic';

  // Mnemonic-related variables
  mnemonic: Array<string> = [];
  emptyMnemonic: Array<string> = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  verifyMnemonic: string[] = [];
  removedWords: { index: number, word: string, status: boolean }[] = [];

  // UI-related variables
  showUsernameRules: boolean = false;
  showEmailRules: boolean = false;
  showPasswordRules: boolean = false;
  showConfirmPasswordRules: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  runSpinner: boolean = true;
  registrationStep: 'initialForm' | 'web3WalletCreation' | 'mnemonic' | 'mnemonicVerification' | 'loadingWalletCreation' | 'importWallet' | 'welcome' = 'initialForm';

  // Other variables
  saltRounds = 10;
  items = [
    { icon: 'image', label: 'Images' },
    { icon: 'trophy', label: 'Achievements' },
    { icon: 'star', label: 'Points' },
    { icon: 'person', label: 'Data' }
  ];

  constructor(
    private http: HttpClient,
    private hederaService: HederaService,
    private alertController: AlertController,
    private fb: FormBuilder,
    private loadingController: LoadingController
  ) { }

  ngOnInit() { }

  async onSubmit() {
    try {
      if (!this.registerForm || !this.registerForm.valid) {
        console.error('Invalid form');
        return;
      }

      const user = this.registerForm.value;

      if (!user) {
        console.error('Failed to retrieve form data');
        return;
      }

      if (!user.username || !user.email || !user.password) {
        console.error('Missing necessary user information');
        return;
      }

      this.userRegisterData = {
        walletId: '',
        username: user.username,
        email: user.email,
        password: user.password,
      };

      this.registrationStep = 'web3WalletCreation';
    } catch (error) {
      console.error('Unexpected error in onSubmit', error);
    }
  }

  async createHederaWallet() {
    try {
      const mnemonic: Mnemonic = await this.hederaService.generateMnemonics();

      if (!mnemonic) {
        console.error('Failed to generate valid mnemonic');
        return;
      }

      this.mnemonic = mnemonic._mnemonic.words;

      const loading = await this.loadingController.create({
        mode: 'ios',
        message: 'Creating you wallet...',
      });

      await loading.present();

      let hederaWalletResponse;
      try {
        hederaWalletResponse = await this.hederaService.createAccount(mnemonic).toPromise();
      } catch (error) {
        console.error('Failed to create Hedera account', JSON.stringify(error, null, 2));
        await loading.dismiss();
        return;
      }

      await loading.dismiss();

      console.log('Hedera wallet response', hederaWalletResponse);
      if (!hederaWalletResponse || !hederaWalletResponse.privateKey || !hederaWalletResponse.id) {
        console.error('Error while creating the Hedera wallet', JSON.stringify(hederaWalletResponse, null, 2));
        return;
      } else {
        console.log('Hedera wallet successfully created', hederaWalletResponse);
      }

      const hederaWallet: IHWalletDTO = hederaWalletResponse;

      const userWallet: IUser = {
        wallet: {
          name: this.userRegisterData.username || '',
          key: hederaWallet.privateKey,
          id: hederaWallet.id || '',
          net: 'testnet' // or 'mainnet'
        },
        contacts: []
      };

      this.userRegisterData.walletId = hederaWallet.id;

      const password = this.userRegisterData.password;
      if (!password) {
        console.error('Password not provided');
        return;
      }

      this.hederaService.saveUserAccount(userWallet, password);

      this.registrationStep = 'mnemonic';
      this.setupMnemonicVerification();

    } catch (error) {
      console.error('Unexpected error in createHederaWallet', JSON.stringify(error, null, 2));
    }
  }


  async importHederaWallet() {
    try {
      if (!this.importWalletForm || !this.importWalletForm.value || !this.importWalletForm.value.walletId) {
        console.error('Wallet ID is required');
        return;
      }

      const walletId: string = this.importWalletForm.value.walletId.toString();

      const password = this.userRegisterData.password;
      if (!password) {
        console.error('Password is required');
        return;
      }

      let privateKey: PrivateKey | null = null;

      if (this.importWalletForm.value.mnemonic && this.importWalletForm.value.mnemonic.length > 1) {
        try {
          privateKey = await this.mnemonicArrayToPrivateKey(this.importWalletForm.value.mnemonic);
        } catch (error) {
          console.error('Failed to convert mnemonic to private key', error);
          return;
        }
      } else if (this.importWalletForm.value.privateKey && this.importWalletForm.value.privateKey != '') {
        try {
          privateKey = PrivateKey.fromString(this.importWalletForm.value.privateKey);
        } catch (error) {
          console.error('Failed to convert private key string to PrivateKey', error);
          return;
        }
      } else {
        console.error('Error importing wallet');
        return;
      }

      if (privateKey === null) {
        console.error('PrivateKey is not assigned');
        return;
      }

      const wallet: IUser = {
        wallet: {
          name: this.userRegisterData.username || '',
          key: privateKey,
          id: walletId,
          net: 'testnet' //'mainnet'
        },
        contacts: []
      };

      try {
        this.hederaService.saveUserAccount(wallet, password);
      } catch (error) {
        console.error('Failed to save user account', error);
        return;
      }

      this.registrationStep = 'welcome';
    } catch (error) {
      console.error('Unexpected error in importHederaWallet', error);
    }
  }

  async mnemonicArrayToPrivateKey(mnemonicArray: any[]) {
    try {
      if (!Array.isArray(mnemonicArray) || mnemonicArray.length === 0) {
        console.error('Invalid mnemonic array');
        return null;
      }

      let mnemonic;
      try {
        mnemonic = await Mnemonic.fromWords(mnemonicArray);
      } catch (error) {
        console.error('Failed to create Mnemonic from words', error);
        return null;
      }

      let privateKey;
      try {
        privateKey = await mnemonic.toStandardEd25519PrivateKey();
      } catch (error) {
        console.error('Failed to create Ed25519PrivateKey from Mnemonic', error);
        return null;
      }

      return privateKey;
    } catch (error) {
      console.error('Unexpected error in mnemonicArrayToPrivateKey', error);
      return null;
    }
  }

  setupMnemonicVerification() {
    try {
      if (!Array.isArray(this.mnemonic) || this.mnemonic.length === 0) {
        console.error('Invalid mnemonic array');
        return;
      }

      let indices;
      try {
        indices = this.getRandomIndices();
      } catch (error) {
        console.error('Failed to get random indices', error);
        return;
      }

      this.verifyMnemonic = [...this.mnemonic];

      for (let i = 0; i < indices.length; i++) {
        const index = indices[i];
        if (index < 0 || index >= this.verifyMnemonic.length) {
          console.error(`Invalid index ${index} for verifyMnemonic`);
          continue;
        }

        this.removedWords.push({ index: index, word: this.verifyMnemonic[index], status: false });
        this.verifyMnemonic[index] = "";
      }
    } catch (error) {
      console.error('Unexpected error in setupMnemonicVerification', error);
    }
  }

  getRandomIndices(): number[] {
    try {
      let indices: number[] = [];
      while (indices.length < 3) {
        let r = Math.floor(Math.random() * 24);
        if (!indices.includes(r)) indices.push(r);
      }
      return indices;
    } catch (error) {
      console.error('Unexpected error in getRandomIndices', error);
      return [];
    }
  }

  checkMnemonicWord(event: any, index: number) {
    try {
      if (!event || !event.target || !event.target.value) {
        console.error('Invalid event data');
        return;
      }

      const wordTyped = event.target.value.toLowerCase();

      let wordRemovedObjectIndex = this.removedWords.find(word => word.index == index)
      if (!wordRemovedObjectIndex) {
        console.error(`No removed word found at index ${index}`);
        return;
      }

      let wordRemoved = wordRemovedObjectIndex.word.toLowerCase();

      if (wordTyped == wordRemoved) {
        wordRemovedObjectIndex.status = true;
      }
    } catch (error) {
      console.error('Unexpected error in checkMnemonicWord', error);
    }
  }

  addToMnemonic(event: any, index: number) {
    try {
      if (!event || !event.target || !event.target.value) {
        console.error('Invalid event data');
        return;
      }

      this.emptyMnemonic[index] = event.target.value.toLowerCase();

      if (!this.importWalletForm || !this.importWalletForm.value) {
        console.error('Invalid importWalletForm data');
        return;
      }

      this.importWalletForm.value.mnemonic = this.emptyMnemonic;
    } catch (error) {
      console.error('Unexpected error in addToMnemonic', error);
    }
  }

  async verifyMnemonicPhrase() {
    try {
      if (!Array.isArray(this.removedWords) || this.removedWords.length === 0) {
        console.error('Invalid removed words array');
        return;
      }

      let isCorrect = this.removedWords.every(word => word.status);

      if (isCorrect) {
        let loading: HTMLIonLoadingElement;
        try {
          loading = await this.loadingController.create({
            mode: 'ios',
            message: 'Finishing registration...',
          });
          await loading.present();
        } catch (error) {
          console.error('Failed to present loading controller', error);
          return;
        }
        bcrypt.hash(this.userRegisterData.password, this.saltRounds, async (err: any, hash: any) => {
          if (err) {
            console.error(err);
          } else {
            this.userRegisterData.password = hash;
            try {
              await this.http.post('http://localhost:3000/users', this.userRegisterData).toPromise();
              console.log('Registration succeeded');
            } catch (error) {
              console.error('Registration failed', error);
            } finally {
              if (loading) {
                loading.dismiss();
              }
            }

            this.registrationStep = 'welcome';
          }
        });


      } else {
        let alert;
        try {
          alert = await this.alertController.create({
            header: 'Error',
            message: 'Mnemonic phrase is not correct.',
            buttons: ['OK']
          });
          await alert.present();
        } catch (error) {
          console.error('Failed to present alert controller', error);
        }
      }
    } catch (error) {
      console.error('Unexpected error in verifyMnemonicPhrase', error);
    }
  }

  async copyMnemonic() {
    try {
      if (!Array.isArray(this.mnemonic) || this.mnemonic.length === 0) {
        console.error('Invalid mnemonic array');
        return;
      }

      const mnemonic = this.mnemonic.join(' ');
      try {
        await navigator.clipboard.writeText(mnemonic);
        console.log('Async: Copying to clipboard was successful!');
      } catch (err) {
        console.error('Async: Could not copy text: ', err);
      }
    } catch (error) {
      console.error('Unexpected error in copyMnemonic', error);
    }
  }

  shouldDisable(index: number): boolean {
    try {
      if (!Array.isArray(this.removedWords) || this.removedWords.length === 0) {
        console.error('Invalid removed words array');
        return false;
      }

      return !this.removedWords.some(x => x.index == index);
    } catch (error) {
      console.error('Unexpected error in shouldDisable', error);
      return false;
    }
  }

  toggleShowPassword() {
    try {
      this.showPassword = !this.showPassword;
    } catch (error) {
      console.error('Unexpected error in toggleShowPassword', error);
    }
  }

  toggleShowConfirmPassword() {
    try {
      this.showConfirmPassword = !this.showConfirmPassword;
    } catch (error) {
      console.error('Unexpected error in toggleShowConfirmPassword', error);
    }
  }

  usernameValidator(control: AbstractControl) {
    try {
      if (!control || !control.value) {
        console.error('Invalid control or value in usernameValidator');
        return of(null);
      }

      return this.http.get('http://localhost:3000/users?username=' + control.value)
        .pipe(map((response: any) => {
          if (Array.isArray(response)) {
            for (const user of response) {
              if (user.username === control.value) {
                return { usernameTaken: true };
              }
            }
          }
          return null;
        }));
    } catch (error) {
      console.error('Unexpected error in usernameValidator', error);
      return of(null);
    }
  }

  emailValidator(control: AbstractControl) {
    try {
      if (!control || !control.value) {
        console.error('Invalid control or value in emailValidator');
        return of(null);
      }

      return this.http.get('http://localhost:3000/users?email=' + control.value)
        .pipe(map((response: any) => {
          if (Array.isArray(response)) {
            for (const user of response) {
              if (user.email === control.value) {
                return { emailTaken: true };
              }
            }
          }
          return null;
        }));
    } catch (error) {
      console.error('Unexpected error in emailValidator', error);
      return of(null);
    }
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value || '';
    const upperCaseCharacters = /[A-Z]+/g;
    const numberCharacters = /[0-9]+/g;
    const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (value.length < 8) {
      return { passwordStrength: 'Password is too short' };
    }
    if (!upperCaseCharacters.test(value)) {
      return { passwordStrength: 'Password must contain at least one upper case character' };
    }
    if (!numberCharacters.test(value)) {
      return { passwordStrength: 'Password must contain at least one number' };
    }
    if (!specialCharacters.test(value)) {
      return { passwordStrength: 'Password must contain at least one special character' };
    }
    return null;
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password: string = control.get('password')?.value || '';
    const confirmPassword: string = control.get('passwordConfirm')?.value || '';
    return password !== confirmPassword ? { NoPassswordMatch: true } : null;
  }

  changeMethod(method: 'mnemonic' | 'privateKey') {
    try {
      this.importMethod = method;
    } catch (error) {
      console.error('Unexpected error in changeMethod', error);
    }
  }

  changeRegisterStep(step: 'initialForm' | 'web3WalletCreation' | 'mnemonic' | 'mnemonicVerification' | 'importWallet' | 'welcome') {
    try {
      this.registrationStep = step;
    } catch (error) {
      console.error('Unexpected error in changeRegisterStep', error);
    }
  }

  trackByFn(index: any) {
    return index;
  }

  async functionLoading(message: string, functionToExecute: any) {
    if (typeof functionToExecute !== 'function') {
      console.error('Invalid function in functionLoading');
      return;
    }

    let loading;
    try {
      loading = await this.loadingController.create({
        message: message,
      });
      await loading.present();
    } catch (error) {
      console.error('Unexpected error while presenting loading', error);
      return;
    }

    try {
      await functionToExecute();
    } catch (error) {
      console.error('Unexpected error in functionToExecute', error);
    } finally {
      if (loading) {
        loading.dismiss();
      }
    }
  }

}
