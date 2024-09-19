import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TeamEntity } from 'src/team/entities/team.entity';
import { TransactionModule } from 'src/transaction/transaction.module';
import { UserModule } from 'src/user/user.module';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { AssetEntity } from './entities/asset.entity';
import { AssetCouponEntity } from './entities/assetCoupon.entity';
import { AssetRedeemEntity } from './entities/assetRedeem.entity';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AssetEntity,
      TeamEntity,
      AssetCouponEntity,
      AssetRedeemEntity,
    ]),
    TransactionModule,
    UserModule,
    SocketModule,
  ],
  controllers: [AssetController],
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetModule {}
