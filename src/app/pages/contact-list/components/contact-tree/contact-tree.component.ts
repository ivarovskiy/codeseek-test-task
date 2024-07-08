import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Contact } from '@models/contact.interface';
import { Store } from '@ngrx/store';
import { AppState } from '@state/app.state';
import { selectAllFavoriteContacts } from '@state/contact/contact.selectors';
import { TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TreeModule } from 'primeng/tree';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact-tree',
  standalone: true,
  imports: [TreeModule, ButtonModule],
  templateUrl: './contact-tree.component.html',
  styleUrl: './contact-tree.component.scss',
})
export class ContactTreeComponent implements OnInit, OnDestroy {
  @Input() contacts!: Contact[];
  @Output() handleSelect = new EventEmitter<Contact>();
  favoriteContacts!: Contact[];

  contactTree!: TreeNode[];
  selectedContact!: Contact;
  treeNodes: TreeNode[] = [];

  subscription: Subscription = new Subscription();
  store = inject(Store<AppState>);
  favoriteContacts$ = this.store.select(selectAllFavoriteContacts);

  ngOnInit() {
    this.subscription.add(
      this.store
        .select(selectAllFavoriteContacts)
        .subscribe(favoriteContacts => {
          this.favoriteContacts = favoriteContacts;
          this.buildTree();
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  buildTree() {
    const groupedContacts = this.contacts.reduce(
      (acc, contact) => {
        const firstLetter = contact.firstName.charAt(0).toUpperCase();
        if (!acc[firstLetter]) {
          acc[firstLetter] = [];
        }
        acc[firstLetter].push(contact);
        return acc;
      },
      {} as Record<string, Contact[]>
    );

    const sortedKeys = Object.keys(groupedContacts).sort((a, b) =>
      a.localeCompare(b)
    );

    const newTreeNodes: TreeNode[] = [];

    if (this.favoriteContacts.length > 0) {
      newTreeNodes.push({
        label: 'Вибрані',
        expanded: true,
        children: [...this.favoriteContacts]
          .sort((a, b) => a.firstName.localeCompare(b.firstName))
          .map(contact => ({
            label: `${contact.firstName} ${contact.lastName}`,
            data: contact,
          })),
      });
    }

    newTreeNodes.push(
      ...sortedKeys.map(letter => ({
        label: letter,
        expanded: true,
        children: [...groupedContacts[letter]]
          .sort((a, b) => a.firstName.localeCompare(b.firstName))
          .map(contact => ({
            label: `${contact.firstName} ${contact.lastName}`,
            data: contact,
          })),
      }))
    );

    this.treeNodes = newTreeNodes;
  }

  onNodeSelect(event: any) {
    this.handleSelect.emit(event.node.data);
  }
}
